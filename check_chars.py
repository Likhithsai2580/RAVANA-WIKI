# Check for special characters in the diagram
with open('docs/Action System/Action Exceptions.md', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('classDiagram')
end = content.find('```', start)
diagram = content[start:end]

print("Diagram length:", len(diagram))
print("First 200 chars:", repr(diagram[:200]))

# Check for special characters
special_count = 0
for i, c in enumerate(diagram):
    if ord(c) > 127:
        print(f"Special character '{c}' (U+{ord(c):04X}) at position {i}")
        special_count += 1
        if special_count > 10:
            break

print(f"Total special characters: {special_count}")

# Check specifically around the inheritance lines
inheritance_start = diagram.find('ActionError <|-- InvalidActionError')
if inheritance_start != -1:
    context = diagram[max(0, inheritance_start-10):inheritance_start+50]
    print("Context around inheritance line:", repr(context))
    for i, c in enumerate(context):
        if ord(c) > 127:
            print(f"Special character in context: '{c}' (U+{ord(c):04X}) at position {i}")