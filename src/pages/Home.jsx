// import TheoTest from '../components/TheoTest';
import Chat from "../components/chat/Chat";

function Home() {
  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="text-2xl text-white text-center mb-2">Nucleus</h1>
        <p className="text-lg text-gray-300 text-center">Discover Unknown</p>
      </div>
      {/* <TheoTest /> */}
      <Chat />
    </div>
  );
}
export default Home;
