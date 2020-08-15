// jsx pragma method to create html dom elements
export default function createElement(tagName, attrs = {}, ...children) {
  const elem = Object.assign(document.createElement(tagName), attrs);
  children.forEach((child) => {
    if (Array.isArray(child)) elem.append(...child);
    else elem.append(child);
  });
  return elem;
}
