
import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX({
  configPath: "source.config.ts",
})

const nextConfig = {
  /* config options here */
}

export default withMDX(nextConfig)
