import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {Card,CardAction,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto w-full">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo diário</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp />+12.5%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Saldo aumentou em 12,5%<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lucros</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">R$6.790</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingDown />-20%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Gastos caíram em 20% <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Bom</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estoque</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45.678
          </CardTitle>
          <CardAction>{/* <Badge variant="outline"><IconTrendingUp />+12.5%</Badge> */}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Estoque dos produtos<IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Ótimo</div>
        </CardFooter>
      </Card>

    </div>
  );
}
