import Sidebar from "@/components/sidebar"

export default async function Layout({children}) {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="pl-72 w-full">
                <div className="h-screen p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
