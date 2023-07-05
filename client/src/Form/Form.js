import React, {useState, useEffect} from 'react';
import "./Form.scss";


function Form() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [text, setText] = useState('');
	const [consent, setConsent] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	useEffect(() => {
		let timeout;
		if (successMessage) {
			timeout = setTimeout(() => {
				setSuccessMessage('');
			}, 5000);
		}

		return () => clearTimeout(timeout);
	}, [successMessage]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateEmail(email) || !consent || !text) {
			return;
		}

		const formData = {
			name,
			email,
			text,
		};
		console.log(formData)

		fetch('http://localhost:3000/send', {
			method: 'post',
			body: JSON.stringify(formData),
		})
			.then(response => response.text())
			.then((result) => {
				console.log(result);
				setSuccessMessage(result);
				resetForm();
			});
	};
	const resetForm = () => {
		setName('');
		setEmail('');
		setText('');
		setConsent(false);
	};

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};
	return (
		<div className="form">
			<h1>Обратный звонок</h1>
			<form onSubmit={handleSubmit}>
				<div className="name">
					<label htmlFor="name">Имя*:</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="email">
					<label htmlFor="email">Email*:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="text">
					<label htmlFor="text">Напишите нам*:</label>
					<textarea
						id="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						required
					/>
				</div>
				<div className="tick">
					<label htmlFor="consent">
						<input
							type="checkbox"
							id="consent"
							checked={consent}
							onChange={(e) => setConsent(e.target.checked)}
							required
						/>
						Согласие на обработку персональных данных*
					</label>
				</div>
				<button type="submit" className="btn">Отправить</button>
			</form>
			{successMessage && <p>{successMessage}</p>}
		</div>
	);
}

export default Form;