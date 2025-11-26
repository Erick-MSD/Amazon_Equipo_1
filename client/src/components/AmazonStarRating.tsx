import React from 'react'

interface AmazonStarRatingProps {
  rating: number
  totalReviews: number
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

const AmazonStarRating: React.FC<AmazonStarRatingProps> = ({ 
  rating, 
  totalReviews, 
  size = 'medium',
  showText = true 
}) => {
  const starSize = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  const textSize = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.floor(rating)
      const partial = i === Math.ceil(rating) && rating % 1 !== 0
      
      stars.push(
        <svg 
          key={i} 
          className={starSize[size]}
          style={{marginRight: '2px'}}
          fill={filled ? '#ff9900' : (partial ? 'url(#half-fill)' : '#e7e7e7')}
          viewBox="0 0 20 20"
        >
          {partial && (
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="#ff9900" />
                <stop offset="50%" stopColor="#e7e7e7" />
              </linearGradient>
            </defs>
          )}
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return stars
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        {renderStars()}
      </div>
      {showText && (
        <>
          <a 
            href="#" 
            style={{
              fontSize: textSize[size] === 'text-xs' ? '12px' : textSize[size] === 'text-sm' ? '14px' : '16px',
              color: '#007185',
              textDecoration: 'none',
              marginLeft: '4px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#c7511f'
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#007185'
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            {rating.toFixed(1)}
          </a>
          <span style={{
            fontSize: textSize[size] === 'text-xs' ? '12px' : textSize[size] === 'text-sm' ? '14px' : '16px',
            color: '#565959'
          }}>
            ({totalReviews.toLocaleString()})
          </span>
        </>
      )}
    </div>
  )
}

export default AmazonStarRating