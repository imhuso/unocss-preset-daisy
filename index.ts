import postcss, {type Rule, type ChildNode} from 'postcss'
import autoprefixer from 'autoprefixer'
import {parse, type CssInJs} from 'postcss-js'
import * as cssTokenizer from 'css-selector-tokenizer'
import type {Preset, DynamicRule, Preflight} from 'unocss'
import camelCase from 'camelcase'
import colors from 'daisyui/src/theming/index.js'
import utilities from 'daisyui/dist/utilities.js'
import base from 'daisyui/dist/base.js'
import unstyled from 'daisyui/dist/unstyled.js'
import styled from 'daisyui/dist/styled.js'
import utilitiesUnstyled from 'daisyui/dist/utilities-unstyled.js'
import utilitiesStyled from 'daisyui/dist/utilities-styled.js'
import themes from 'daisyui/src/theming/themes.js'
import colorFunctions from 'daisyui/src/theming/functions.js'
import utilityClasses from 'daisyui/src/lib/utility-classes.js';

// 添加模块声明
declare module 'css-selector-tokenizer' {
    export interface Token {
        type: string;
        name: string;
        content?: string;
        value?: string;
    }

    export interface Selector {
        type: 'selector';
        nodes: Token[];
    }

    export interface Selectors {
        type: 'selectors';
        nodes: Selector[];
    }

    export function parse(selector: string): Selectors;
}

const processor = postcss(autoprefixer)
const process = (object: CssInJs) => processor.process(object, {parser: parse})

const replacePrefix = (css: string) => css.replaceAll('--tw-', '--un-')

export const defaultOptions = {
	styled: true,
	themes: false as
		| boolean
		| Array<string | Record<string, Record<string, string>>>,
	base: true,
	utils: true,
	rtl: false,
	darkTheme: 'dark',
}

export const presetDaisy = (
	options: Partial<typeof defaultOptions> = {},
): Preset => {
	options = {...defaultOptions, ...options}

	const rules = new Map<string, string>()
	const specialRules: Record<string, string[]> = {
		keyframes: [],
		supports: []
	};
	const nodes: Rule[] = []

	const styles = [
		options.styled ? styled : unstyled
	]
	if (options.utils) {
		styles.push(utilities, utilitiesUnstyled, utilitiesStyled)
	}

	const categorizeRules = (node: ChildNode) => {
		if (node.type === 'rule') {
				nodes.push(node);
		} else if(node.type === 'atrule') {
			if(Array.isArray(specialRules[node.name])) {
				specialRules[node.name]!.push(String(node));
			} else if(node.nodes) {
					// ignore and keep traversing, e.g. for @media
				for (const child of node.nodes) {
						categorizeRules(child);
				}
			}
		}
	};
	styles
		.flatMap((style) => process(style).root.nodes as ChildNode[])
		.forEach((node) => categorizeRules(node));

	for (const node of nodes) {
		const selector = node.selectors[0]!
		let base = ''

		// 使用 css-selector-tokenizer 解析选择器
		const tokens = cssTokenizer.parse(selector)
		const firstSelector = tokens.nodes[0]
		const firstToken = firstSelector?.nodes[0]

		if (firstToken?.type === 'class') {
			// 处理类选择器
			if (selector.startsWith('.link-')) {
				base = 'link'
			} else if (selector.startsWith('.modal-open')) {
				base = 'modal'
			} else {
				base = firstToken.name
			}
		} else if (firstToken?.type === 'pseudo' && firstToken.name === 'where') {
			// 处理 :where() 伪类
			if (firstToken.content) {
				const innerTokens = cssTokenizer.parse(firstToken.content).nodes[0]?.nodes || []
				const classToken = innerTokens.find(t => t.type === 'class')
				if (classToken) {
					base = classToken.name
				}
			}
		} else if (firstToken?.type === 'attribute' && firstToken.name === 'dir') {
			// 处理 [dir="rtl"] 选择器
			const classToken = firstSelector?.nodes.find(t => t.type === 'class')
			if (classToken) {
				if (selector.includes('.modal-open')) {
					base = 'modal'
				} else {
					base = classToken.name
				}
			}
		} else if (firstToken?.type === 'tag' && firstToken.name === 'root') {
			// 处理 :root 选择器
			const classToken = firstSelector?.nodes.find(t => t.type === 'class')
			if (classToken) {
				if (selector.includes('.modal-open')) {
					base = 'modal'
				} else {
					base = classToken.name
				}
			}
		}

		if (base) {
			rules.set(base, (rules.get(base) ?? '') + String(node) + '\n')
		}
	}

	const preflights: Preflight[] = Object.entries(specialRules).map(([key, value]) => ({
		getCSS: () => value.join('\n'),
		layer: `daisy-${key}`,
	}));

	if (options.base) {
		preflights.unshift({
			getCSS: () => replacePrefix(process(base).css),
				layer: 'daisy-base',
		})
	}

	if (options.themes !== false) {
		colorFunctions.injectThemes(
			theme => {
				preflights.push({
					getCSS: () => process(theme).css,
					layer: 'daisy-themes',
				})
			},
			key => {
				if (key === 'daisyui.themes') {
					return options.themes
				}

				if (key === 'daisyui.darkTheme') {
					return options.darkTheme
				}

				return undefined
			},
			themes,
		)
	}
	
	return {
		name: 'unocss-preset-daisy',
		preflights,
		theme: {
			colors: {
				...Object.fromEntries(
					Object.entries(colors)
						.filter(
							([color]) =>
								!['transparent', 'current'].includes(color)
								&& !color.startsWith('base'),
						)
						.map(([color, value]) => [camelCase(color), value]),
				),
				base: Object.fromEntries(
					Object.entries(colors)
						.filter(([color]) => color.startsWith('base'))
						.map(([color, value]) => [color.replace('base-', ''), value]),
				),
			},
			...utilityClasses
		},
		rules: [...rules].map(
			([base, rule]) =>
				[
					new RegExp(`^${base}$`),
					() => replacePrefix(rule),
					{
						layer: base.startsWith('checkbox-')
							? 'daisy-components-post'
							: 'daisy-components',
					},
				] satisfies DynamicRule,
		),
		variants: [
			(matcher: string) => {
				if (!matcher.startsWith('theme-')) return matcher
				return {
					matcher: matcher.slice(6),
					selector: (s: string) => `[data-theme~="${matcher.slice(6)}"] ${s}`,
				}
			},
		],
	}
}

