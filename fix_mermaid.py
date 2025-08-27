import os
import re

def fix_mermaid_syntax(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    # Pattern for ([...])
    pattern1 = re.compile(r'([a-zA-Z0-9_]+)\(\[([^\]]+)\]\)')
    # Pattern for ([("...")])
    pattern2 = re.compile(r'([a-zA-Z0-9_]+)\(\[\("([^"]+)"\)\]\)')

    new_content = pattern1.sub(r'\1("\2")', content)
    new_content = pattern2.sub(r'\1("\2")', new_content)

    if new_content != content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
        except Exception as e:
            print(f"Error writing to {file_path}: {e}")

def main():
    docs_path = 'docs'
    for root, _, files in os.walk(docs_path):
        for file in files:
            if file.endswith('.md'):
                fix_mermaid_syntax(os.path.join(root, file))

if __name__ == '__main__':
    main()
