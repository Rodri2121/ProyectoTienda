package gm.tiendaproject.controller;

import gm.tiendaproject.repository.CategoriaRepository;
import gm.tiendaproject.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class TiendaController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping("/")
    public String mostrarInicio(
            @RequestParam(value = "nombreBuscar", required = false) String nombreBuscar,
            @RequestParam(value = "categoriaBuscar", required = false) String categoriaBuscar,
            Model model) {

        // 1. Búsqueda y Filtro Combinado
        var productos = productoService.buscarProductosFiltrados(nombreBuscar, categoriaBuscar);

        // 2. Obtener categorías para llenar el <select>
        var categorias = categoriaRepository.findAll();

        // 3. Enviar datos a Thymeleaf
        model.addAttribute("productos", productos);
        model.addAttribute("categorias", categorias);

        // 4. Enviar los parámetros de vuelta para que el formulario "recuerde" qué se buscó
        model.addAttribute("nombreBuscar", nombreBuscar);
        model.addAttribute("categoriaBuscar", categoriaBuscar);

        return "index";
    }
}