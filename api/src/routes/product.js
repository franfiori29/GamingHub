const server = require('express').Router();
const { Op } = require('sequelize');
const { Product, Category } = require('../db.js');
//----------"/products"--------------

server.get('/', (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.send(products);
		})
		.catch(next);
});

server.get('/search', (req, res) => {
	const { query } = req.query;
	if (query) {
		Product.findAll({
			where: {
				[Op.or]: [
					{ name: { [Op.iLike]: `%${query}%` } },
					{ description_es: { [Op.iLike]: `%${query}%` } },
					{ description_en: { [Op.iLike]: `%${query}%` } }
				]
			}
		})
			.then((products) => {
				res.status(200).json(products);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ message: 'Internal server error', })
			})

	} else {
		res.status(400).json({ message: "Query is empty" });
	}
})

server.post('/category', (req, res) => {
	const { name_es, name_en } = req.body
	Category.create({ name_en, name_es })
		.then((data) => {
			res.status(201).json({
				message: 'OK',
				data
			})
		})
		.catch(() => {
			res.status(400).json({
				message: 'Bad Request'
			})
		})
})

server.get('/category/:catName', (req, res) => {
	let { catName } = req.params
	catName = catName.toLowerCase();
	Product.findAll({
		include: [{
			model: Category,
			where: {
				[Op.or]: [
					{ name_en: catName },
					{ name_es: catName }
				]
			}
		}]
	})
		.then(data => res.json(data))
})

server.put('/category/:catId', (req, res) => {
	let { catId } = req.params;
	let { name_es, name_en } = req.body;
	Category.update({
		name_es,
		name_en
	}, {
		where: { id: catId },
		returning: true
	})
		.then(data => {
			data = data[1][0]
			res.status(200).json({
				message: "Category edited successfuly.",
				data
			})
		})
})

server.delete('/category/:catId', (req, res) => {
	const { catId } = req.params;
	var category = {};
	Category.findOne({
		where: { id: catId }
	})
		.then(data => {
			category = data;
			return Category.destroy({
				where: { id: catId }
			})
		})
		.then(() => {
			res.json(category)
		})
})

server.post('/:prodId/category/:catId', (req, res) => {
	let { prodId, catId } = req.params;
	let prod = Product.findOne({
		where: { id: prodId }
	})
	let cat = Category.findOne({
		where: { id: catId }
	})
	Promise.all([prod, cat])
		.then(([prod, cat]) => {
			prod.addCategories(cat)
			res.status(201).json({ message: "Product associated with category successfully." })
		})
})

server.delete('/:prodId/category/:catId', (req, res) => {
	let { prodId, catId } = req.params;
	let prod = Product.findOne({
		where: { id: prodId }
	})
	let cat = Category.findOne({
		where: { id: catId }
	})
	Promise.all([prod, cat])
		.then(([prod, cat]) => {
			prod.removeCategories(cat)
			res.status(200).json({ message: "Category deleted." })
		})
})

server.delete('/:id', (req, res) => {
	const prodId = req.params.id;
	Product.destroy({
		where: {
			id: prodId
		}
	}).then(data => {
		if (!data) {
			res.status(404).json({ message: 'Product not found.' })
		} else {
			res.status(200).json({ message: 'Product deleted.' })
		}
	}).catch(() => {
		res.status(500).json({
			message: 'Internal server error',
		})
	});
})

module.exports = server;