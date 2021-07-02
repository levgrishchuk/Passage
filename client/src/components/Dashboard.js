import useAuth from "./useAuth";

function Dashboard({ code }) {
    const data = useAuth(code);
    // console.log(data);
    return (
        <div>
            Hello
        </div>
    )
}
export default Dashboard;
