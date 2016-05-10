VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    
    #configurazione globale: usa ubuntu 14.04LTS
    config.vm.box = "ubuntu/trusty64"
    
    #configurazione della macchina "db"
    config.vm.define "db" do |node|
       
        node.vm.hostname = "db"  

        node.vm.network "private_network", ip: "10.10.10.100", virtualbox__intnet: true

        node.vm.provider "virtualbox" do |v| 
            v.memory = 1024 
        end 

        node.vm.network "forwarded_port", guest: 22, host: 2211, id: 'ssh', auto_correct: true
        
        node.ssh.forward_agent = true

        node.vm.provision "puppet"

    end

    #configurazione della macchina "app"
    config.vm.define "app" do |node|
    	  
    	node.vm.hostname = "app"    
        
        node.vm.network "private_network", ip: "10.10.10.200", virtualbox__intnet: true

        node.vm.provider "virtualbox" do |v| 
            v.memory = 1024 
        end 

        node.vm.network "forwarded_port", guest: 22, host: 2221, id: 'ssh', auto_correct: true
        
        node.vm.network "forwarded_port", guest: 3000, host: 3000, id: 'node', auto_correct: true

        node.ssh.forward_agent = true

        #node.vm.synced_folder "./ASW-Progetto-MEAN", "/home/vagrant/ASW-Progetto-MEAN", :mount_options => ["dmode=777", "fmode=777"]  
 		node.vm.provision "file", source: "./ASW-Progetto-MEAN", destination: "/home/vagrant/ASW-Progetto-MEAN"
        
        node.vm.provision "puppet"
    end
end
