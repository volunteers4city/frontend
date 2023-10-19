import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line import/no-unresolved
import 'swiper/scss';
import CardNews from '../CardNews/CardNews';
import cardsArray from '../../utils/cardsArray';

function Slider({ news }) {
	let newsData;
	if (news) {
		newsData = news.map((item) => ({
			...item,
			cardId: uuidv4(),
		}));
	}

	return (
		<Swiper
			spaceBetween={20}
			slidesPerView={3}
			onSlideChange={() => console.log('slide change')}
			onSwiper={(swiper) => console.log(swiper)}
		>
			{newsData &&
				newsData.map((card) => (
					<SwiperSlide key={card.cardId}>
						<CardNews card={card} />
					</SwiperSlide>
				))}
		</Swiper>
	);
}

Slider.propTypes = {
	news: PropTypes.arrayOf(
		PropTypes.shape({
			tags: PropTypes.arrayOf(PropTypes.string),
			title: PropTypes.string,
			date: PropTypes.string,
		})
	),
};

Slider.defaultProps = {
	news: cardsArray,
};

export default Slider;