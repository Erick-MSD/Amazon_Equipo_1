import React from 'react'

interface RatingData {
  5: number
  4: number
  3: number
  2: number
  1: number
}

interface AmazonRatingBreakdownProps {
  ratings: RatingData
  totalReviews: number
  averageRating: number
}

const AmazonRatingBreakdown: React.FC<AmazonRatingBreakdownProps> = ({ 
  ratings, 
  totalReviews, 
  averageRating 
}) => {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
  }

  return (
    <div style={{fontFamily: 'Amazon Ember, Arial, sans-serif'}}>
      {/* Overall Rating */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
        <span style={{fontSize: '28px', fontWeight: '400', color: '#0f1111', marginRight: '8px'}}>
          {averageRating.toFixed(1)}
        </span>
        <span style={{fontSize: '14px', color: '#0f1111'}}>de 5</span>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            style={{width: '20px', height: '20px', marginRight: '2px'}}
            className={star <= Math.floor(averageRating) ? 'text-orange-400' : 'text-gray-300'}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <div style={{fontSize: '14px', color: '#565959', marginBottom: '16px'}}>
        {totalReviews.toLocaleString()} calificaciones globales
      </div>

      {/* Rating Breakdown */}
      <div>
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
            <a 
              href="#" 
              style={{
                color: '#007185', 
                textDecoration: 'none', 
                fontSize: '13px',
                minWidth: '60px',
                marginRight: '8px'
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
              {stars} estrella{stars !== 1 ? 's' : ''}
            </a>
            <div style={{
              flex: 1,
              height: '20px',
              backgroundColor: '#e7e7e7',
              borderRadius: '2px',
              overflow: 'hidden',
              maxWidth: '200px',
              marginRight: '8px'
            }}>
              <div 
                style={{
                  height: '100%',
                  backgroundColor: '#ff9900',
                  width: `${getPercentage(ratings[stars as keyof RatingData])}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <a 
              href="#" 
              style={{
                color: '#007185', 
                textDecoration: 'none', 
                fontSize: '13px',
                minWidth: '30px',
                textAlign: 'right'
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
              {getPercentage(ratings[stars as keyof RatingData])}%
            </a>
          </div>
        ))}
      </div>

      {/* Review this product */}
      <div style={{marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e7e7e7'}}>
        <div style={{fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#0f1111'}}>
          Revisar este producto
        </div>
        <div style={{fontSize: '14px', color: '#565959', marginBottom: '12px'}}>
          Comparte tus pensamientos con otros clientes
        </div>
        <button 
          style={{
            width: '100%',
            padding: '8px 16px',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            backgroundColor: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            color: '#0f1111'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f8f8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Escribir una reseña de cliente
        </button>
      </div>
    </div>
  )
}

export default AmazonRatingBreakdown