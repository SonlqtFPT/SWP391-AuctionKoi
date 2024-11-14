import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import RequestDetails from '../components/RequestDetails';

function BreederRequestDetailsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-grow">
                <RequestDetails />
            </div>
            <Footer />
        </div>
    );
}

export default BreederRequestDetailsPage
