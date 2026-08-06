import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {

    return (

        <>

            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >

                <Sidebar />

                <main
                    style={{
                        flex: 1,
                        padding: "20px"
                    }}
                >
                    {children}
                </main>

            </div>

        </>

    );

}

export default MainLayout;