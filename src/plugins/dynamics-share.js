export default class dynamicsMeta {
  constructor(title='', description='', image='', type='', url = document.location.href) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.type = type;
    this.url = url;
    this.items = [];
  }

  add( type, title, description, image, url = document.location.href ){
    this.type = type || this.type;
    this.title = title || this.title;
    this.description = description || this.description;
    this.image = image || this.image;
    const findIndex = this.items.findIndex(i => i.type === type);
    if(findIndex !== -1 && findIndex !== undefined){
      this.items[findIndex] = { type, title, description, image, url }
    }else{
      this.items.push({type, title, description, image, url});
    }
  };

  save(){
    for(let key in this.items){
      switch(this.items[key].type){
        case 'facebook': {
          const {title, description, image, url} = this.items[key];
          this.insert(this.getMetaFacebook('image', image));
          this.insert(this.getMetaFacebook('description', description));
          this.insert(this.getMetaFacebook('title', title));
          this.insert(this.getMetaFacebook('url', url));
          this.insert(this.getMetaFacebook());
          break;
        }
      }
    }
  }

  getMetaFacebook(type, value=''){
    let meta = document.createElement('meta');
    meta.setAttribute('id-dynamics-soc-meta', 'true');
    switch(type){
      case 'title': {
        meta.setAttribute('property', 'og:title');
        meta.setAttribute('content', value);
        return meta;
      };
      case 'description': {
        meta.setAttribute('property', 'og:description');
        meta.setAttribute('content', value);
        return meta;
      };
      case 'image': {
        meta.setAttribute('property', 'og:image');
        meta.setAttribute('content', value);
        return meta;
      };
      case 'url':{
        meta.setAttribute('property', 'og:url');
        meta.setAttribute('content', value);
        return meta;
      }
      default: {
        meta.setAttribute('property', 'og:type');
        meta.setAttribute('content', 'article');
        return meta;
      }
    }
  }
  insert(meta){
    document.getElementsByTagName('title')[0].after(meta);
  }
  delete(){
    let elements = document.querySelectorAll("meta[id-dynamics-soc-meta='true']");
    for(var i = 0; i < elements.length; i++){
      elements[i].parentNode.removeChild(elements[i]);
    }
  }
  show(){
    console.log(this.items);
  }
}