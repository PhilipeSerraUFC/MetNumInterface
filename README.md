
# Oi


sudo apt install curl -y


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash


source ~/.bashrc


nvm install --lts

module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Seu Nome',
          homepage: 'https://seusite.com'
        }
      }
    }
  ]
};
