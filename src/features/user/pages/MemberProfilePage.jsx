import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import MemberProfile from '../components/MemberProfile'

function MemberProfilePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
                <MemberProfile />
            </div>
            <Footer />
        </div>
    )
}

export default MemberProfilePage
