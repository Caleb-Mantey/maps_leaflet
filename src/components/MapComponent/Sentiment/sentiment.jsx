import React from 'react'

import { FaRegSmileBeam, FaRegMehBlank } from 'react-icons/fa'
import { CgSmileSad } from 'react-icons/cg'

import classes from './Sentiment.module.scss'


export default function Sentiment({ polarity, classOptions }) {
    return (
        <>{
            (polarity >= -1 && polarity < 0) ?
                <>
                    <CgSmileSad className={`${classes['sentiment-marker']} ${classes.bad} bad ${classOptions.join(' ')}`} />
                    <span className={`${classes['sentiment-marker-text']}`}>Negative</span>
                </>
                :
                (polarity >= 0 && polarity < 0.5) ?
                    <>
                        <FaRegMehBlank className={`${classes['sentiment-marker']} ${classes.neutral} neutral ${classOptions.join(' ')}`} />
                        <span className={`${classes['sentiment-marker-text']}`}>Neutral</span>
                    </>
                    :
                    (polarity >= 0.5 && polarity <= 1) ?
                        <>
                            <FaRegSmileBeam className={`${classes['sentiment-marker']} ${classes.good} good ${classOptions.join(' ')}`} />
                            <span className={`${classes['sentiment-marker-text']}`}>Positive</span>
                        </>
                        : ''
        }</>
    )
}

