import { defineConfig } from 'vite'
import UnoCSS from '@unocss/vite'
import { presetUno } from '@unocss/preset-uno'
import { presetDaisy } from '../index'
import themes from 'daisyui/src/theming/themes'

export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetUno(),
				presetDaisy({
					themes: [
						{
							mytheme: {
								...themes.light,
								'primary': '#1A1A1A',
								'secondary': '#EF4444',
								'accent': '#3B82F6',
								'--rounded-box': '0.4rem',
								'--padding-card': '1rem',
							},
						},
						'light',
						'dark',
						'cupcake',
						'bumblebee',
						'emerald',
						'corporate',
						'synthwave',
						'retro',
						'cyberpunk',
						'valentine',
						'halloween',
						'garden',
						'forest',
						'aqua',
						'lofi',
						'pastel',
						'fantasy',
						'wireframe',
						'black',
						'luxury',
						'dracula',
						'cmyk',
						'autumn',
						'business',
						'acid',
						'lemonade',
						'night',
						'coffee',
						'winter'
					],
				}),
			],
		}) as any,
	],
	build: {
		target: 'esnext'
	}
})
