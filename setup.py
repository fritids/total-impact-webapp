from setuptools import setup, find_packages

setup(
    name = 'totalimpactwebapp',
    version = '0.2.0',
    packages = find_packages(),
    install_requires = [
        "Flask==0.7.2",
        "Flask-Login",
        "Flask-WTF",
        "couchdb",
        "requests",
        "simplejson",
        "iso8601",
        "pytz"
	],
    url = '',
    author = 'total-impact',
    author_email = 'totalimpactdev@gmail.com',
    description = 'source code for the webapp at http://total-impact.org',
    license = 'MIT',
    classifiers = [
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)

