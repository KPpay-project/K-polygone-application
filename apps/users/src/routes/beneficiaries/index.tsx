import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/beneficiaries/')({
  component: RouteComponent,
})


function RouteComponent() {
  return <Beneficiaries />
}
