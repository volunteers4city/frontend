import './CheckboxConfirm.scss';
import PropTypes from 'prop-types';

function CheckboxConfirm({ onClick, htmlFor, name, checked }) {
	return (
		<>
			<p className="checkbox-confirm__text">
				Нажимая кнопку «Отправить данные», я подтверждаю, что мне исполнилось 18
				лет, и соглашаюсь с Политикой конфиденциальности
			</p>
			<label htmlFor={htmlFor} className="checkbox-confirm__text">
				<input
					id={htmlFor}
					name={name}
					type="checkbox"
					className="checkbox-confirm__checkbox"
					checked={checked}
					onChange={onClick}
				/>
				Даю согласие на обработку моих персональных данных
			</label>
		</>
	);
}

CheckboxConfirm.propTypes = {
	onClick: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	htmlFor: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
};

export default CheckboxConfirm;
