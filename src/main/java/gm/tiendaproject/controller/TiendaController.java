package gm.tiendaproject.controller;

import gm.tiendaproject.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TiendaController {

    @Autowired
    private ProductoService productoService;
//
    @GetMapping("/")
    public String mostrarInicio(Model model) {
        var productos = productoService.obtenerTodosLosProductos();
        model.addAttribute("productos", productos);
        return "index";
    }
}