<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Validation\Factory;



require_once __DIR__ . '/../vendor/autoload.php';

$translator = new \Illuminate\Translation\Translator(
	new \Illuminate\Translation\ArrayLoader('cs', 'group'), 'cs'
);

$validator = (new Factory($translator))->make($_POST, [
	'name'  => 'required',
	'email' => 'required|email'
]);

if ($validator->errors()->any()) {
	echo json_encode([
		'name'  => !$validator->errors()->has('name'),
		'email' => !$validator->errors()->has('email'),
	]);
	die;
}

$capsule = new Capsule;

$capsule->addConnection([
	'driver'    => 'mysql',
	'host'      => '',
	'database'  => '',
	'username'  => '',
	'password'  => '',
	'charset'   => 'utf8',
	'collation' => 'utf8_unicode_ci',
	'prefix'    => '',
]);

$capsule->setAsGlobal();

Capsule::table('christmas')->insert([
	'name'       => $_POST['name'],
	'email'      => $_POST['email'],
	'newsletter' => isset($_POST['newsletter'])
]);

echo json_encode(['success' => true]);
