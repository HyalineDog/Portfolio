# Device frame

Puts a screenshot inside a laptop frame. Used for the EDH Deck Grader case study.

1. Take a 16:10 screenshot: a 1440×900 viewport at 2× scale looks sharpest.
2. Run:

   ```bash
   npm i -D playwright   # once
   node tools/device-frame/render.cjs path/to/shots path/to/out results.png="Hero Results"
   ```

3. The output is a transparent PNG, so it works on the light and dark themes.
   Convert it to WebP before committing to keep the file small.
