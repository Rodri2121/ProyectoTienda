package gm.tiendaproject.service;

import gm.tiendaproject.model.Producto;
import gm.tiendaproject.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }

    public List<Producto> obtenerPorCategoria(String operations) {
        return productoRepository.findByCategoriaNombre(operations);
    }
}//