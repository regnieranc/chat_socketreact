import React from 'react'

export default function Mensaje(props){
	console.log(props, 'cvbnm,mnbvcxcvbnm,')
	return(
		<div>
			<div style={{margin: 4, padding: 4, display: 'inline-block', backgroundColor: props.yo?	'#cce5ff':'#D4FFCC' }}>
				<div style={{fontWeight: 'bold', fontSize: 8}}>{props.nick}: </div>
				{props.mensaje}
			</div>
		</div>
		
	)
}