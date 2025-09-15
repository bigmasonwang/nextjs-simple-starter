import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { blog } from "@/lib/source"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()
  const Mdx = page.data.body

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <Button variant="ghost" size="sm" asChild className="self-start mb-4">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
            {page.data.title}
          </h1>

          {page.data.description && (
            <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
              {page.data.description}
            </h3>
          )}

          <div className="flex items-center gap-3 text-sm md:text-base">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src="" />
              <AvatarFallback>
                {(page.data.author || "A").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>
              <span className="font-semibold">
                {page.data.author || "Anonymous"}
              </span>
              <span className="ml-1">
                on{" "}
                {page.data.date
                  ? new Date(page.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date unknown"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">
          <Mdx components={defaultMdxComponents} />
        </div>
      </div>
    </section>
  )
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map(page => ({
    slug: page.slugs[0],
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug])
  if (!page) notFound()
  return {
    title: page.data.title,
    description: page.data.description,
  }
}
