# unocss-preset-daisy

UnoCSS preset for daisyUI

## 安装

```bash
npm install unocss-preset-daisy
```

## 使用方法

```javascript
import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  plugins: [
    unocss({
      presets: [presetUno(), presetDaisy()],
    }),
  ],
})
```

// ... 其他内容可以保持不变
