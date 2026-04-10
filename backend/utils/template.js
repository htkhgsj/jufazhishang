export function fillTemplate(template, vars) {
  //prompt: a yaml object
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return vars[key] || "";
  });

}