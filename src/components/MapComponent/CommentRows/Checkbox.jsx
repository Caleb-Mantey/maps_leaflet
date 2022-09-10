import React,{ useState }  from 'react'
import './checkbox.scss'
const Checkbox = () => {
	const [isChecked, setIsChecked] = useState(false)
	return (
		<div onClick={()=>setIsChecked(!isChecked)} className="checkboxWrapper">
			<input type="checkbox" checked={isChecked}/>
			<span className="checkboxSpan"></span>
		</div>
	)
}

export default Checkbox
