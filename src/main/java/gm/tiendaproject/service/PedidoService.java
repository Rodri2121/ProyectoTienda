package gm.tiendaproject.service;

import gm.tiendaproject.dto.PedidoDTO;
import gm.tiendaproject.model.DetallePedido;
import gm.tiendaproject.model.Pedido;
import gm.tiendaproject.model.Producto;
import gm.tiendaproject.repository.DetallePedidoRepository;
import gm.tiendaproject.repository.PedidoRepository;
import gm.tiendaproject.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional // Si algo falla, revierte todos los cambios en la BD
    public Pedido GuardarPedido(PedidoDTO dto) {
        // Crear y guardar el Pedido
        Pedido pedido = new Pedido();
        pedido.setNombreCliente(dto.getNombreCliente());
        pedido.setCorreo(dto.getCorreo());
        pedido.setComentario(dto.getComentario());
        pedido.setTotal(BigDecimal.ZERO); // Lo calcula sumando los productos

        final Pedido pedidoGuardado = pedidoRepository.save(pedido);

        final double[] totalPedido = {0.0};

        // Procesa cada producto del carrito
        dto.getItems().forEach(itemDto -> {
            Producto producto = productoRepository.findById(itemDto.getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Validar stock básico
            if (producto.getStock() < itemDto.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            // Calcular subtotales
            double subtotalValue = producto.getPrecio().doubleValue() * itemDto.getCantidad();
            totalPedido[0] += subtotalValue;

            // Restar del stock de la tienda
            producto.setStock(producto.getStock() - itemDto.getCantidad());
            productoRepository.save(producto);

            // Crear el Detalle
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedidoGuardado);
            detalle.setProducto(producto);
            detalle.setCantidad(itemDto.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(BigDecimal.valueOf(subtotalValue));
//
            detallePedidoRepository.save(detalle);
        });

        // Actualiza el total definitivo del pedido
        pedidoGuardado.setTotal(BigDecimal.valueOf(totalPedido[0]));
        return pedidoRepository.save(pedidoGuardado);
    }
}