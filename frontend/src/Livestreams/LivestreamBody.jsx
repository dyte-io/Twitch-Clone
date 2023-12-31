/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLivestreams } from "../utils";

import { Spinner } from "@chakra-ui/react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8000";

const LivestreamBody = () => {
	const [offset, setOffset] = useState(0);
	const [streams, setStreams] = useState([]);

	const setLivestreamsToState = async () => {
		const { data } = await getLivestreams(offset);
		const rawThumbnailsDataRes = await fetch(`${SERVER_URL}/img_link_upload`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		const thumbnails = await rawThumbnailsDataRes.json();
		const upvotesRawRes = await fetch(`${SERVER_URL}/stats`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		const upvotes = await upvotesRawRes.json();
		console.log(upvotes);
		const livestreamWithThumbnails = data.map((item) => ({
			...item,
			upvotes: upvotes.filter(
				(subItem) => item.meeting_id === subItem[1]
			)[0] || [0],
			name: thumbnails.filter(
				(subItem) => item.meeting_id === subItem[1]
			)[0] || [undefined, undefined, undefined],
			thumbnail: thumbnails.filter(
				(subItem) => item.meeting_id === subItem[1]
			)[0] || [undefined],
		}));
		const rawViewsCountData = await fetch(`${SERVER_URL}/viewers_count`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		const views = await rawViewsCountData.json();
		const streams = livestreamWithThumbnails.map((item) => ({
			...item,
			views: views.filter((subItem) => item.meeting_id === subItem[0])[0] || [
				0,
			],
		}));
		console.log(streams);
		setStreams(streams);
		setOffset((cur) => {
			return cur + 20 < data.total ? cur + 20 : "END";
		});
	};

	const handleClick = (meetingId) => {
		fetch(`${SERVER_URL}/viewers_count/${meetingId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
	};

	useEffect(() => {
		setLivestreamsToState();
	}, []);

	return (
		<div style={{ backgroundColor: "white" }}>
			<div
				style={{
					fontSize: "1.3em",
					textAlign: "left",
					paddingLeft: "50px",
					fontWeight: "bold",
					paddingTop: "20px",
					color: "black",
				}}
			>
				Newest <span style={{ color: "red" }}>Live</span> Videos
			</div>
			<div
				style={{
					display: "flex",
					padding: "0px 20px 10px 40px",
					justifyContent: "flex-start",
					flexWrap: "wrap",
				}}
			>
				{streams.length ? (
					streams.map((item) => {
						return (
							item.meeting_id && (
								<Link
									style={{ textDecoration: "none" }}
									onClick={() => handleClick(item.meeting_id)}
									to={`/meeting/${item.meeting_id}`}
								>
									<div style={{ margin: "20px 10px" }}>
										<div style={{ position: "relative" }}>
											<img
												src={
													item.thumbnail[0] ||
													"https://m.media-amazon.com/images/M/MV5BYzBiYjlhNGEtNjJkNi00NDc0LWIyMDMtMTg0NDUwZjcxNmY4XkEyXkFqcGdeQXVyMjg2MTMyNTM@._V1_.jpg"
												}
												height={"200px"}
												style={{
													aspectRatio: "1920/1080",
													borderRadius: "0px",
													border: "solid 0.5px gray",
												}}
											/>
											<div
												style={{
													margin: "4px 4px 4px 6px",
													fontSize: "small",
													backgroundColor:
														item.status === "LIVE" ? "red" : "gray",
													padding: "1px 8px",
													borderRadius: "2px",
													position: "absolute",
													top: "5px",
													left: "5px",
													fontWeight: "bold",
													color: "white",
												}}
											>
												{item.status}
											</div>
										</div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												color: "black",
											}}
										>
											<div style={{ margin: "4px 4px 4px 0px" }}>
												{!item.name[2]
													? `Meeting: ${item.meeting_id}`.length > 18
														? `Meeting: ${item.meeting_id}`.substring(0, 15) +
														  "..."
														: `Meeting: ${item.meeting_id}`
													: item.name.length > 18
													? item.name[2].substring(0, 15) + "..."
													: item.name[2]}
											</div>
										</div>
										<div
											style={{
												display: "flex",
												fontSize: "small",
												color: "gray",
											}}
										>
											<div style={{ margin: "4px 4px 4px 0px" }}>
												{item.views[1] || 0} views
											</div>
											<div style={{ margin: "4px 0px" }}>&#8226;</div>
											<div style={{ margin: "4px" }}>
												{item.upvotes[0] || 0} upvotes
											</div>
										</div>
									</div>
								</Link>
							)
						);
					})
				) : (
					<Spinner
						size="xl"
						width="60px"
						height="60px"
						color="black"
						alignItems="center"
						marginLeft="50px"
						marginTop="50px"
						marginBottom="50px"
					/>
				)}
			</div>

			<div
				style={{
					fontSize: "1.3em",
					textAlign: "left",
					paddingLeft: "50px",
					fontWeight: "bold",
					paddingTop: "20px",
					color: "black",
				}}
			>
				Trending <span style={{ color: "red" }}>Live</span> Videos
			</div>
			<div
				style={{
					display: "flex",
					padding: "10px 40px",
					justifyContent: "flex-start",
					flexWrap: "wrap",
				}}
			>
				{streams.length ? (
					streams
						.map((item) => item)
						.sort((a, b) => b.upvotes[0] - a.upvotes[0])
						.map((item) => {
							return (
								item.meeting_id && (
									<Link
										style={{ textDecoration: "none" }}
										to={`/meeting/${item.meeting_id}`}
									>
										<div style={{ margin: "15px" }}>
											<div style={{ position: "relative" }}>
												<img
													src={
														item.thumbnail[0] ||
														"https://m.media-amazon.com/images/M/MV5BYzBiYjlhNGEtNjJkNi00NDc0LWIyMDMtMTg0NDUwZjcxNmY4XkEyXkFqcGdeQXVyMjg2MTMyNTM@._V1_.jpg"
													}
													height={"200px"}
													style={{
														aspectRatio: "1920/1080",
														borderRadius: "0px",
														border: "solid 0.5px gray",
													}}
												/>
												<div
													style={{
														margin: "4px 4px 4px 6px",
														fontSize: "small",
														backgroundColor:
															item.status === "LIVE" ? "red" : "gray",
														padding: "1px 8px",
														borderRadius: "2px",
														position: "absolute",
														top: "5px",
														left: "5px",
														fontWeight: "bold",
														color: "white",
													}}
												>
													{item.status}
												</div>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													color: "black",
													position: "relative",
												}}
											>
												<div style={{ margin: "4px 4px 4px 0px" }}>
													{!item.name[2]
														? `Meeting: ${item.meeting_id}`.length > 18
															? `Meeting: ${item.meeting_id}`.substring(0, 15) +
															  "..."
															: `Meeting: ${item.meeting_id}`
														: item.name.length > 18
														? item.name[2].substring(0, 15) + "..."
														: item.name[2]}
												</div>
											</div>
											<div
												style={{
													display: "flex",
													fontSize: "small",
													color: "gray",
												}}
											>
												<div style={{ margin: "4px 4px 4px 0px" }}>
													{item.views[1] || 0} views
												</div>
												<div style={{ margin: "4px 0px" }}>&#8226;</div>
												<div style={{ margin: "4px" }}>
													{item.upvotes[0] || 0} upvotes
												</div>
											</div>
										</div>
									</Link>
								)
							);
						})
				) : (
					<Spinner
						size="xl"
						width="60px"
						height="60px"
						color="black"
						alignItems="center"
						marginLeft="50px"
						marginTop="50px"
						marginBottom="50px"
					/>
				)}
			</div>
		</div>
	);
};

export default LivestreamBody;
