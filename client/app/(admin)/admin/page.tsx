import { usePathname, useRouter } from "next/navigation";

const AdminDashboardPage = () => {
    const router = useRouter()

    const pathname = usePathname()

    if(pathname.startsWith('/admin') && pathname.endsWith('/')) {
        return router.push('/admin/blog')
    }
    return (
        <></>
    )
}


export default AdminDashboardPage;