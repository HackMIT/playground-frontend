class Page {
	addClickListener(id, callback) {
		document.getElementById(id).addEventListener('click', callback);
	}
}

export default Page;
