import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { processMarkdown } from '../../lib/markdown';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import TableOfContents from '../../components/TableOfContents';
import MermaidRenderer from '../../components/MermaidRenderer';
import CodeBlock from '../../components/CodeBlock';

export default function DocPage({ doc, docs }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prism highlighting
      if (window.Prism) {
        window.Prism.highlightAll();
      }

      // Wrap pre tags with CodeBlock component
      const preElements = document.querySelectorAll('article pre:not(.mermaid pre)');
      preElements.forEach(preEl => {
        if (preEl.parentElement.classList.contains('code-block-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        preEl.parentNode.insertBefore(wrapper, preEl);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<CodeBlock htmlString={preEl.outerHTML} />);
        preEl.remove();
      });
    }
  }, [doc]);

  return (
    <Layout docs={docs}>
      <Head>
        <title>{doc.title ? `${doc.title} - RAVANA AGI Documentation` : 'RAVANA AGI Documentation'}</title>
        <meta name="description" content={doc.title ? `Documentation for ${doc.title}` : 'RAVANA AGI Documentation'} />
      </Head>

      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"
        strategy="beforeInteractive"
      />

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-grow">
          <Breadcrumb doc={doc} />
          <article className="max-w-none bg-wiki-content-bg p-8 rounded-lg shadow-2xl flex-grow border border-wiki-border">
            <h1 className="text-wiki-text-light font-bold text-5xl mb-8 border-b border-wiki-border pb-4">{doc.title}</h1>
            <div className="prose prose-invert max-w-none">
              <MermaidRenderer content={doc.content} />
            </div>
          </article>
        </div>

        <div className="w-full xl:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <TableOfContents />
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper function to get the title of a markdown file
async function getDocTitle(filePath) {
  const content = await readFile(filePath, 'utf8');
  const titleMatch = content.match(/^#\s+(.*)$/m);
  return titleMatch ? titleMatch[1] : path.basename(filePath, '.md').replace(/-/g, ' ');
}

// Helper function to recursively get all docs
async function getDocs(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const docs = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        const indexFile = path.join(res, `${dirent.name}.md`);
        let title;
        try {
          title = await getDocTitle(indexFile);
        } catch {
          title = dirent.name.replace(/-/g, ' ');
        }
        return {
          title: title,
          children: await getDocs(res),
        };
      } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
        const title = await getDocTitle(res);
        return {
          title,
          slug: path.relative(path.join(process.cwd(), 'docs'), res).replace('.md', ''),
        };
      }
      return null;
    })
  );
  return docs.filter(Boolean).sort((a, b) => a.title.localeCompare(b.title));
}

export async function getStaticPaths() {
  const paths = [];
  const docsDir = path.join(process.cwd(), 'docs');

  async function findMarkdownFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        await findMarkdownFiles(res);
      } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
        const slug = path.relative(docsDir, res).replace('.md', '').split(path.sep);
        paths.push({ params: { slug } });
      }
    }
  }

  await findMarkdownFiles(docsDir);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const filePath = path.join(docsDir, ...params.slug) + '.md';
    const content = await readFile(filePath, 'utf8');
    const { html, frontmatter } = await processMarkdown(content);
    const title = frontmatter.title || await getDocTitle(filePath);

    const docs = await getDocs(docsDir);

    return {
      props: {
        doc: {
          slug: params.slug.join('/'),
          title,
          content: html,
        },
        docs,
      },
    };
  } catch (error) {
    console.error('Error loading document:', error);
    return {
      notFound: true,
    };
  }
}