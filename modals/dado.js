export default class Dado{
    lanzar() {
        return Math.floor(Math.random()*6)+1;
    }
}