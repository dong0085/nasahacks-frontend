import TheoTest from '../components/TheoTest';
import ChatBox from '../components/chatbox';

function Home() {
  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="text-2xl text-white text-center mb-2">Nucleus</h1>
        <p className="text-lg text-gray-300 text-center">Discover Unknown</p>
      </div>
      <ChatBox></ChatBox>
      {/* <TheoTest /> */}
    </div>
  );
}
export default Home;
