node 'db' {
	include mongodb
}

node 'app' {
	include nodejs
}

exec { 'apt-get update':
	command => '/usr/bin/apt-get update'
}

class mongodb {
	exec { 'configure mongo':
		command => "/bin/sed -i -- 's/bind_ip/#bind_ip/g' /etc/mongodb.conf | sudo service mongodb restart",
		require => Package['mongodb']
	}
	package { 'mongodb':
		ensure => present,
		require => Exec['apt-get update'],
		before => Exec['configure mongo']
	}
	service { 'mongodb':
		require => Package['mongodb'],
		ensure => running,
		enable => true
	}
	
}	

class nodejs {
	package { 'nodejs':
		ensure => present,
		require => Exec['pre-nodejs','apt-get update']
	}
	package { 'git':
		ensure => present
	}
	exec { 'pre-nodejs':
		command => '/usr/bin/curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -'
	}
	exec { 'configure service':
		command => '/bin/cp /home/vagrant/ASW-Progetto-MEAN/nodejs.conf /etc/init/nodejs.conf',
		require => Package['nodejs'],
		provider => 'shell'
	}
	exec { 'npm':
		command => '/usr/bin/npm install',
		require => Exec['configure service'],
		cwd => '/home/vagrant/ASW-Progetto-MEAN'
	}
	exec { 'bower':
		command => '/home/vagrant/ASW-Progetto-MEAN/node_modules/bower/bin/bower install --allow-root',
		cwd => '/home/vagrant/ASW-Progetto-MEAN',
		require => [Exec['npm'], Package['git']]
	}
	service { 'nodejs':
		require => Exec['bower'],
		ensure => running,
		enable => true
	}
}