import React from "react"

type RouterProps = {
    children: React.ReactNode,
    route: string,
}

type RouteProps = {
    children: any,
    path: string
}

export const Route = ({ children }: RouteProps) => children

const Router = ({ children, route }: RouterProps) => {
    const routes = React.Children.toArray(children) as React.ReactElement[];
    return <>
        {routes.filter((r) => r.props.path === route)}
    </>
}

Router.Route = Route;

export default Router