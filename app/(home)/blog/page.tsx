import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { blog } from "@/lib/source"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Home() {
  const posts = blog.getPages()

  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Blog Posts
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Discover the latest trends, tips, and best practices in modern web
            development. From UI components to design systems, stay updated with
            our expert insights.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map(post => (
            <Card key={post.url} className="grid grid-rows-[auto_1fr_auto]">
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <Link href={post.url}>{post.data.title}</Link>
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>By {post.data.author || "Anonymous"}</span>
                  <span>•</span>
                  <span>
                    {post.data.date
                      ? new Date(post.data.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Date unknown"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {post.data.description ||
                    "Read this blog post to learn more..."}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={post.url}
                  className="flex items-center text-foreground hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
