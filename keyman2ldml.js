

function prettyPrintXml(xmlString) {
  const PADDING = "  " // 2 spaces
  const reg = /(>)(<)(\/*)/g
  let xml = xmlString.replace(reg, "$1\n$2$3")
  let pad = 0
  return xml
    .split("\n")
    .map((node) => {
      let indent = ""
      if (node.match(/^<\/\w/)) pad -= 1
      for (let i = 0; i < pad; i++) indent += PADDING
      if (node.match(/^<\w([^>]*[^/])?>.*$/) && !node.includes("</")) pad += 1
      return indent + node
    })
    .join("\n")
}


export function convertKvksToLdml(kvksXmlString) {
  const parser = new DOMParser()
  const sourceDoc = parser.parseFromString(kvksXmlString, "application/xml")

  const destDoc = document.implementation.createDocument("urn:ldml:keyboard", "keyboard", null)
  const keyboard = destDoc.documentElement

  // Extract metadata
  const header = sourceDoc.querySelector("header")
  const version = header?.querySelector("version")?.textContent.trim()
  const kbdname = header?.querySelector("kbdname")?.textContent.trim() || "Converted Keyboard"
  const flags = [...header?.querySelectorAll("displayunderlying")].map(f => f.tagName)

  const encoding = sourceDoc.querySelector("encoding")
  const fontname = encoding?.getAttribute("fontname")
  const fontsize = encoding?.getAttribute("fontsize")

  // <names>
  const names = destDoc.createElement("names")
  const name = destDoc.createElement("name")
  name.setAttribute("value", kbdname)
  names.appendChild(name)
  keyboard.appendChild(names)

  // <version>
  if (version) {
    const ver = destDoc.createElement("version")
    ver.setAttribute("platform", "keyman")
    ver.textContent = version
    keyboard.appendChild(ver)
  }

  // <info>
  const info = destDoc.createElement("info")
  const desc = destDoc.createElement("description")
  desc.textContent = "Converted from Keyman .kvks"
  info.appendChild(desc)

  if (fontname) {
    const font = destDoc.createElement("font")
    font.setAttribute("name", fontname)
    if (fontsize) font.setAttribute("size", fontsize)
    info.appendChild(font)
  }

  for (const flag of flags) {
    const feature = destDoc.createElement("feature")
    feature.setAttribute("name", flag)
    info.appendChild(feature)
  }

  keyboard.appendChild(info)

  // Build keySet and keyMapSet
  const keySet = destDoc.createElement("keySet")
  const keyMapSet = destDoc.createElement("keyMapSet")
  const keySeen = new Set()

  const layers = sourceDoc.getElementsByTagName("layer")
  for (const layer of layers) {
    const layerId = layer.getAttribute("shift") || "default"
    const keyMap = destDoc.createElement("keyMap")
    keyMap.setAttribute("id", layerId)

    for (const key of layer.getElementsByTagName("key")) {
      const from = key.getAttribute("vkey")
      const to = key.textContent.trim()
      if (!from || !to) continue

      // <key> (only once per id)
      if (!keySeen.has(from)) {
        const keyElem = destDoc.createElement("key")
        keyElem.setAttribute("id", from)
        keyElem.setAttribute("to", to)
        keySet.appendChild(keyElem)
        keySeen.add(from)
      }

      // <map>
      const map = destDoc.createElement("map")
      map.setAttribute("from", from)
      map.setAttribute("to", to)
      keyMap.appendChild(map)
    }

    keyMapSet.appendChild(keyMap)
  }
  
  keyboard.appendChild(keySet)
  keyboard.appendChild(keyMapSet)

  // Serialize
  const serializer = new XMLSerializer()
  const rawXml = serializer.serializeToString(destDoc)

  // Re-parse the output for validation
  const parsed = new DOMParser().parseFromString(rawXml, "application/xml")

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        prettyPrintXml(new XMLSerializer().serializeToString(parsed))
}