---
title: Keyman to LDML Converter
author: Patrick Hall
---

This is a lightweight, client-side web tool that converts Keyman On-Screen Keyboard (`.kvks`) files into LDML keyboard definitions (`.ldml`). It uses modern JavaScript, requires no server, and runs entirely in the browser.

## 🌐 Features

- ✅ Upload and parse `.kvks` (Keyman Visual Keyboard) files
- ✅ Convert to LDML keyboard format with correct structure
- ✅ Validates structure (basic sanity check)
- ✅ Pretty-prints the XML output
- ✅ In-browser display and live download of `.ldml` file
- ✅ Preserves metadata (keyboard name, version, font)
- ✅ Works offline

---

## 🚀 Getting Started

1. Open `index.html` in your browser.
2. Click "Choose File" and upload a `.kvks` file.
3. Click **Convert**.
4. Review the LDML output and status message.
5. Click **Download LDML** to save the result.

---

## 📂 Example

You can try converting the included sample file:

- [`esperanto.kvks`](./esperanto.kvks)

It defines a basic Esperanto keyboard with shift and lowercase layers.

---

## 🧪 Validation

The app performs in-browser **structural validation**, ensuring:

- A `<keyboard>` root exists
- `<keySet>` and `<keyMapSet>` are present
- All `<key>` and `<map>` elements have required attributes (`id`, `to`, `from`)

Invalid files will show a red status message.

---

## 🛠️ File Naming

When you upload a file like:

```
bamum.kvks
```

The downloaded file will be named:

```
bamum.ldml
```

---

## 📁 File Structure

```
keyman2ldml-web/
├── index.html           # Main interface
├── keyman2ldml.js       # Conversion logic (DOM-based)
├── esperanto.kvks       # Sample keyboard file
```

---

## 📜 License

MIT — free to use, modify, and share.

---

## 🧠 Ideas for the Future

- Interactive typing interface from LDML
- Upload multiple `.kvks` files at once
- Integration with external validators
- Keyboard preview and layout visualization


Please feel free to [file an issue]](https://github.com/amundo/keyman2ldml/issues/new).