import { defineConfig } from 'vite'
// eslint-disable-next-line n/file-extension-in-import
import unocss from 'unocss/vite'
import { presetUno } from 'unocss'
import { presetDaisy } from '../index'

export default defineConfig({
	plugins: [
		unocss({
			presets: [
				presetUno(),
				presetDaisy({
					themes: true,
				}),
			],
		}),
	],
})
