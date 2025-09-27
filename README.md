<h1 style="color:#6a0dad; text-align:center; font-size:40px; margin-bottom:10px;">
  🛒 Full-Stack E-Commerce Portfolio Website
</h1>

<p style="text-align:center; font-size:18px; color:#444;">
  A beautiful and scalable e-commerce platform built with <b>Next.js (Frontend)</b>, 
  <b>Express (Backend)</b>, and <b>Caddy (Reverse Proxy)</b>.
</p>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">🖼️ Homepage Preview</h2>
<p style="text-align:center;">
  <img src="https://raw.githubusercontent.com/abdullah-rust/dyzora/main/dyzora/public/screenshot.png" alt="Homepage Screenshot" width="800" style="border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);" />
</p>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">✨ Features</h2>
<ul style="line-height:1.8; font-size:16px;">
  <li>🛍️ Full e-commerce functionality (products, categories, banners, images)</li>
  <li>🔑 Authentication with Google login</li>
  <li>🍪 Secure cookies (works with Caddy reverse proxy for same-origin policy)</li>
  <li>⚡ Optimized full-stack architecture (Express + Next.js)</li>
  <li>📦 Package management with <code>pnpm</code></li>
  <li>🚧 Currently under active development</li>
</ul>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">⚙️ Reverse Proxy (Caddy Config)</h2>

<pre style="background:#f4f4f4; padding:15px; border-radius:8px; font-size:14px;">
:80 {
    route {

        handle_path /api/user/* {
            reverse_proxy localhost:3001
        }

        handle {
            reverse_proxy localhost:3000
        }
    }
}
</pre>

<p style="font-size:14px; color:#666;">
⚠️ Note: Caddy is required to set cookies properly because browsers only allow 
cookies in same-origin requests.
</p>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">📂 Project Structure</h2>
<pre style="background:#f4f4f4; padding:15px; border-radius:8px; font-size:14px;">
/public
  /banners     (ignored in git)
  /categories  (ignored in git)
  /images      (ignored in git)
  /products    (ignored in git)
  
/src
  /pages
  /components
  /lib
  /server (Express backend)
</pre>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">🚀 Getting Started</h2>

<ol style="line-height:1.8; font-size:16px;">
  <li>Clone this repository</li>
  <li>Add your own images inside <code>/public</code> folders (since they are ignored in git)</li>
  <li>Install dependencies with:
    <pre style="background:#f4f4f4; padding:10px; border-radius:8px;">pnpm install</pre>
  </li>
  <li>Run the project using:
    <pre style="background:#f4f4f4; padding:10px; border-radius:8px;">pnpm dev</pre>
  </li>
  <li>Make sure to run Caddy as shown above</li>
</ol>

<hr style="margin:30px 0;"/>

<h2 style="color:#6a0dad;">🛡️ Notes</h2>
<ul style="line-height:1.8; font-size:16px;">
  <li>This project is still in <b>development phase</b>.</li>
  <li>Contributions and suggestions are welcome.</li>
  <li>Future updates will include payment integration and admin dashboard.</li>
</ul>

<hr style="margin:30px 0;"/>

<p style="text-align:center; font-size:14px; color:#666;">
  Crafted with ❤️ by <b>Abdullah Riaz</b>
</p>
