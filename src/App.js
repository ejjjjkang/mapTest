import logo from "./logo.svg";
import "./App.css";
import Board from "./components/Board";
import MusicRecommend from "./components/MusicRecommend";
import dotenv from "dotenv";

function App() {
	dotenv.config();
	const key = process.env.MAP_KEY;

	return (
		<div className="App">
			<Board key={key}></Board>
			<MusicRecommend></MusicRecommend>
		</div>
	);
}

export default App;
