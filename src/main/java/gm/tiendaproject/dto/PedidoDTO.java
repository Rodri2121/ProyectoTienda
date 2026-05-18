package gm.tiendaproject.dto;

import lombok.Data;
import java.util.List;

@Data
public class PedidoDTO {
    private String nombreCliente;
    private String correo;
    private String comentario;
    private List<ItemCarritoDTO> items;
//
    @Data
    public static class ItemCarritoDTO {
        private Long id; // ID del producto
        private Integer cantidad;
    }
}