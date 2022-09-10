import React from 'react'
import './ProgressBar.scss'

const SentimentProgressBar = ({color}) => {
	return (
		<div>
			{color === "green" && <div className="myProgressGreen">
				<div className="myBarGreen"></div>
			</div>}

			{color==="red"&&<div className="myProgressRed">
				<div className="myBarRed"></div>
			</div>}

			{color==="yellow"&&<div className="myProgressYellow">
				<div className="myBarYellow"></div>
			</div>}
		</div>
	)
}

export default SentimentProgressBar
