package gm.tiendaproject.controller;

import gm.tiendaproject.dto.PedidoDTO;
import gm.tiendaproject.model.Pedido;
import gm.tiendaproject.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoApiController {

    @Autowired
    private PedidoService pedidoService;
//
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoDTO pedidoDTO) {
        try {
            if (pedidoDTO.getItems() == null || pedidoDTO.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("El carrito no puede estar vacío.");
            }
            Pedido nuevoPedido = pedidoService.GuardarPedido(pedidoDTO);
            return ResponseEntity.ok(nuevoPedido);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el pedido: " + e.getMessage());
        }
    }
}