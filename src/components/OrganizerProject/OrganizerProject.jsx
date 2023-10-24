import SelectOption from '../SelectOption/SelectOption';
import './OrganizerProject.scss';
import projectImage from '../../images/project-image.png';

function Project() {
	return (
		<section className="project">
			<div className="project__name-container">
				<h1 className="project__name">Название проекта*</h1>
				<input
					className="project__button project__edit-name-button"
					type="button"
					aria-label="Редактировать название"
				/>
			</div>

			<div className="project__content">
				<div className="project__image-wrapper">
					<img
						className="project__image"
						alt="Изображение проекта"
						src={projectImage}
					/>
					<div className="project__upload-image-container">
						<span className="project__upload-image-label">
							Загрузить фотографию*
						</span>
						<input
							className="project__button project__upload-image-button"
							type="button"
							aria-label="Загрузить фотографию"
						/>
					</div>
				</div>

				<div className="project__form-wrapper">
					<h2 className="project__group-label">Общая информация</h2>

					<div className="project__group project__group-general">
						<label className="project__label" htmlFor="project__textarea">
							Описание проекта*
							<textarea className="project__textarea" type="text" />
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__textarea">
							Цель проекта*
							<textarea className="project__textarea" type="text" />
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__textarea">
							Мероприятия
							<textarea
								className="project__textarea"
								type="text"
								placeholder="Например: Лекция по экологии; Посадка саженцев;"
							/>
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__textarea">
							Задачи проекта*
							<textarea
								className="project__textarea"
								type="text"
								placeholder="Опишите, какие задачи будут стоять перед волонтёрами: к примеру, «уборка территории» и «высадка деревьев»"
							/>
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__textarea">
							Организатор предоставляет:
							<textarea
								className="project__textarea"
								type="text"
								placeholder="Например: саженцы, перчатки, обед"
							/>
							<span className="project__error-message">Error</span>
						</label>
					</div>

					<h2 className="project__group-label">Место проведения</h2>
					<div className="project__group project__group-place">
						<SelectOption label="Город" placeholder="Выберите город" required />
						<label className="project__label" htmlFor="project__text-input">
							Адрес*
							<input
								className="project__text-input"
								type="text"
								placeholder="Улица, дом, корпус, строение"
							/>
							<span className="project__error-message">Error</span>
						</label>
					</div>

					<h2 className="project__group-label">Сроки проведения</h2>
					<div className="project__group project__group-date">
						<label className="project__label" htmlFor="project__text-input">
							Дата проведения*
							<input
								className="project__text-input"
								type="text"
								placeholder="01.02.2023"
							/>
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__text-input">
							Время проведения (местное время)*
							<input
								className="project__text-input"
								type="text"
								placeholder="10:00 - 16:00"
							/>
							<span className="project__error-message">Error</span>
						</label>
						<label className="project__label" htmlFor="project__text-input">
							Дата подачи заявок*
							<input
								className="project__text-input"
								type="text"
								placeholder="02.10.2023 - 12.10.2023"
							/>
							<span className="project__error-message">Error</span>
						</label>
					</div>

					<h2 className="project__group-label">Дополнительная информация</h2>
					<div className="project__group project__group-additional">
						<SelectOption
							label="Категория проекта"
							placeholder="Выберите категорию"
							isMulti
							required
						/>
						<SelectOption
							label="Навыки"
							placeholder="Выберите навыки"
							isMulti
							required
						/>
					</div>

					<div className="project__form-buttons">
						<input
							className="project__form-send-button project__button-primary"
							type="button"
							aria-label="Сохранить изменения"
							value="Сохранить изменения"
						/>
						<input
							className="project__form-send-button"
							type="button"
							aria-label="Отменить изменения"
							value="Отменить изменения"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Project;