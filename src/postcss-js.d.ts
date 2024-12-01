declare module 'postcss-js' {
  export type CssValue = string | number | CssInJs | undefined
  
  export interface CssInJs {
    [key: string]: CssValue
  }

  export function parse(css: string): CssInJs
  export function objectify(node: any): CssInJs
  export function sync(plugins: any[]): (css: CssInJs) => CssInJs
  export function async(plugins: any[]): (css: CssInJs) => Promise<CssInJs>
  export function process(css: CssInJs, opts?: any): Promise<CssInJs>
  export function processSync(css: CssInJs, opts?: any): CssInJs
} 
